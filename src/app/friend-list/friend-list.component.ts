import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as M from 'materialize-css';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {CryptoService} from '../crypto.service';
import * as sjcl from 'sjcl';
import * as ab2str from 'arraybuffer-to-string';
import * as str2ab from 'string-to-arraybuffer';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
  peopleSearchChanged = new BehaviorSubject<string>('');
  people = [];
  pendingRequest = [];
  unApprovedRequest = [];
  chatFriends = [];
  secretKeys = {};

  constructor(private _dataService: DataService, private _cryptoService: CryptoService, private _router: Router) {}

  ngOnInit() {
    this._dataService.needToApprove().subscribe(
      data => {
        // @ts-ignore
        this.unApprovedRequest = data.data;
      }
    );

    this.getFriends();
  }

  ngAfterViewInit() {
    let elems = document.querySelectorAll('.tabs');
    let instance = M.Tabs.init(elems, {});

    this.peopleSearchChanged
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
      if (value !== '') {
        this.people = [];
        const username = this._dataService.currentUser.username;
        console.log(username);
        if (username !== value) {
          this._dataService.findUser({username: value}).subscribe(
            data => {
              // @ts-ignore
              this.people = this.people.concat(data.data);
              // @ts-ignore
              this.pendingRequest = this.pendingRequest.concat(data.pending);
              this.pendingRequest = this.pendingRequest.map(a => a.to_id);
              // console.log(this.pendingRequest);
              console.log(this.people);
            }
          );
        }
      }
    });
  }

  onSearchPeople(value: string) {
    this.peopleSearchChanged.next(value);
  }

  getFriends() {
    this.chatFriends = [];
    this._dataService.getFriends().subscribe(
      data => {
        // @ts-ignore
        this.chatFriends = data.data;
      }
    );
  }

  generateSecretKey(){
    return window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  exportKeyAes(key: any){
    return window.crypto.subtle.exportKey('jwk', key);
  }

  jwkToString(jwk){
    return JSON.stringify(jwk);
  }

  stringToJwk(raw: string){
    return JSON.parse(raw);
  }

  importAes(jwk){
    return crypto.subtle.importKey('jwk', jwk, {name: 'AES-GCM'} as DhImportKeyParams, true, ['encrypt', 'decrypt']);
  }

  importPublicKey(user_id: string){
    return window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(user_id)),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      }, true, ['encrypt']);
  }

  importPrivateKey(){
   return window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem('myprivatekey')),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      }, true,['decrypt']);
  }

  encryptPublic(key, plainText){
    return window.crypto.subtle.encrypt({name: 'RSA-OAEP'}, key, str2ab(plainText));
  }

  decryptPrivate(key, encrypted) {
    return window.crypto.subtle.decrypt({name: 'RSA-OAEP'}, key, encrypted);
  }


  inviteFriend(value: any) {
    let to_id;
    if (value.user_id) {
      to_id = value.user_id;
    } else {
      to_id = value.user_id;
    }
    this._dataService.inviteUser({to_id: to_id}).subscribe(
      data => {
        console.log(data);
        this.pendingRequest.push(to_id);
        this.onSearchPeople(this.peopleSearchChanged.getValue());
      }
    );
  }

  // filter list by friends names
  onKeyUp(event) {
    const searchQuery = $('.active .search-friends').val();
    $('.active ul li:not(:first)').each(function() {
      if ($(this).find('.middle h5').text().toLowerCase().includes(searchQuery.toLowerCase())) {
        $(this).removeClass('hide');
      } else {
        $(this).addClass('hide');
      }
    });
  }

  checkPending(id) {
    return this.pendingRequest.includes(id);
  }

  cancelRequest(id) {
    return this._dataService.cancelRequest({id: id}).subscribe(
      data => {
        const i = this.pendingRequest.indexOf(id);
        if (i !== -1) {
          delete this.pendingRequest[i];
        }
        this.onSearchPeople(this.peopleSearchChanged.getValue());
      }
    );
  }

  rejectRequest(id) {
    return this._dataService.rejectRequest({id: id}).subscribe(
      data => {
        this.removeByAttr(this.unApprovedRequest, 'user_id', id);
        // this.removeByAttr(this.unApprovedRequest, 'user_id', id);
      }
    );
  }

  removeByAttr(arr, attr, value) {
    let i = arr.length;
    while (i--) {
      if ( arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value ) ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  acceptRequest(id) {
    this.generateSecretKey().then((key) =>{
      this.secretKeys[id] = key;
      this.exportKeyAes(key).then((jwk) =>{
        console.log(jwk);
        let toBeStored = this.jwkToString(jwk);
        this.importPublicKey(id.toString()).then((publicKey) => {
          this.encryptPublic(publicKey, toBeStored).then((encrypted) => {
            // console.log(ab2str(encrypted, 'base64'));
            // console.log(encrypted);
            // todo encrypt tobeStored with password
            toBeStored = sjcl.encrypt(this._dataService.chatPassword, toBeStored);
            return this._dataService.acceptRequest({id: id, key: JSON.stringify(toBeStored), pending: ab2str(encrypted, 'base64')})
              .subscribe(
              data => {
                // console.log(data);
                // @ts-ignore
                this.getFriends();
                this.rejectRequest(id);
              }
            );
          });
        });
      });
    });
  }

  enterChatRoom(id) {
    this._dataService.getRoom({id: id}).subscribe(
      data => {
        // @ts-ignore
        const room_id = data.room_id;
        // @ts-ignore
        const their_id = data.user;
        // @ts-ignore
        const secret = data.secret;
        // @ts-ignore
        const pending = data.pending;
        if(secret){
          console.log('yow guys');
          this.importAes(this.stringToJwk(sjcl.decrypt(this._dataService.chatPassword, JSON.parse(secret)))).then((seccc)=>{
            this.secretKeys[id] = seccc;
          });
        } else{
          console.log('yow hiere');
          this.importPrivateKey().then((key) => {
            // console.log(pending);
            // console.log(str2ab(pending));
            this.decryptPrivate(key, str2ab(pending)).then((decrypted) => {
              // console.log(ab2str(decrypted));
              this.importAes(JSON.parse(ab2str(decrypted))).then((secretKey) => {
                this.secretKeys[id] = secretKey;
                const toBeStored = sjcl.encrypt(this._dataService.chatPassword, ab2str(decrypted));
                this._dataService.updateSecret({id: id, secret: JSON.stringify(toBeStored)}).subscribe(
                  theData => {
                    console.log(theData);
                  }
                );
              });
            });
          });
        }

        // @ts-ignore
        this._router.navigate(['/chat', room_id, id]);
      }
    );

  }
}
