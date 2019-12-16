import { RESTDataSource } from 'apollo-datasource-rest';
import 'dotenv/config';

export class PostAPI extends RESTDataSource {
    
    constructor() {
        super();
        this.baseURL = process.env.POST_URL;
    }

    async getPost(id) {
        return this.get(`posts/${id}`);
    }

    async getPosts() {
        const data = await this.get('posts');
        return data;
    }

    async newPost(post) {
        return this.post(
            `posts`,
            post
        );
    }

}