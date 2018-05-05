import { Injectable } from '@angular/core';
import { AppError } from '../errors/apperror';
import { NotFoundError } from '../errors/not-found-error';

import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PostsService {

  private url: string;

  constructor(private http: Http) {
    this.url = 'http://jsonplaceholder.typicode.com/posts';
  }

  public getPosts(){
    return this.http.get(this.url);
  }

  public createPost(post){
    return this.http.post(this.url,JSON.stringify(post))
                    .catch((error:Response) => {
                      if(error.status === 400)
                        return Observable.throw(new BadInputError(error))
                      return Observable.throw(new AppError(error.json()));
                    });
  }

  public updatePost(post){
     this.http.patch(this.url+'/'+post.id,JSON.stringify({isRead:true}))
                    .subscribe(response => {
                      console.log(response.json());
                    },
                    (error: Response) => {
                      if(error.status === 404){
                        return Observable.throw(new NotFoundError(error.json()))
                      }
                      return Observable.throw(new AppError(error.json()))
                    });
  }

  public deletePost(id:number){
    return this.http.delete(this.url+'/'+id)
                    .catch((error:Response) => {

                      if(error.status === 404){
                        return Observable.throw(new NotFoundError(error.json()))
                      }
                      return Observable.throw(new AppError(error.json()))
                    });
  }

}
