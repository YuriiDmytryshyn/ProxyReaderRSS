import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss']
})
export class NewsDetailsComponent implements OnInit {

  news;

  constructor(public router: Router) { this.news = JSON.parse(localStorage.getItem('news') || '{}') }

  ngOnInit(): void { }

  removeLocalItem(): void {
    localStorage.removeItem('news');
    this.router.navigateByUrl('news');
  }
}
