import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
    public feeds: Array<string>
    constructor(
        public id: number,
        public email: string,
        public password: string,
    ) {
        this.feeds = [
            'https://www.nasa.gov/rss/dyn/breaking_news.rss',
            'https://www.reddit.com/.rss',
            'https://www.mobileworldlive.com/latest-stories/feed'
        ]
    }
}