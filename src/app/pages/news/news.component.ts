import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import * as xml2js from "xml2js";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  currentUser: IUser;
  selectedFeed: string = "";
  rss: any;
  ifFeed: boolean = false;
  newFeed: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userAuthService: UserAuthService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  ngOnInit(): void { }

  onFeedChange(feed: string): void {
    this.rss = null;
    this.selectedFeed = feed;
    this.apiService.getData(new URL(feed).pathname, {
      observe: "body",
      responseType: "text"
    }).subscribe(data => {
      let parseString = xml2js.parseString;
      parseString(data, (err, result) => {
        if (!result) {
          console.log(err);
        }
        if ('rss' in result) {
          this.rss = result.rss.channel[0].item;
        } else if ('feed' in result) {
          this.rss = result.feed.entry;
        }
      });
    }, err => {
      console.log(err);
    });
  }

  addFeed(): void {
    this.currentUser.feeds.push(this.newFeed);
    this.updateUser();
  }

  deleteFeed(id: number): void {
    this.currentUser.feeds.splice(id, 1);
    this.updateUser();
  }

  details(item: object): void {
    localStorage.setItem('news', JSON.stringify(item))
    this.router.navigateByUrl('news-details');
  }

  openInputAdd(): void {
    this.ifFeed = !this.ifFeed
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('login');
  }

  private updateUser(): void {
    const UPDATE_USER = {
      id: this.currentUser.id,
      email: this.currentUser.email,
      password: this.currentUser.password,
      feeds: this.currentUser.feeds
    }
    this.userAuthService.updateUser(UPDATE_USER).subscribe(() => {
      localStorage.setItem('user', JSON.stringify(UPDATE_USER));
      this.newFeed = '';
    },
      err => {
        console.log(err);

      })
  }
}
