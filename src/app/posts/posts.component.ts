import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PostsService } from '../services/posts.service';
import { AppError } from '../errors/apperror';
import { NotFoundError } from '../errors/not-found-error';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements  OnInit{

  posts:any[];

  constructor(private service: PostsService) {

  }

  public createPost(title: HTMLInputElement){

    if(title.value!== undefined && title.value.trim().length>0){

      let index =  Number(this.posts[this.posts.length-1].id)+1;
      let post = {
        'userId':1,
        'id':index,
        'title':title.value,
        'body':'bla bla bla bla bla'
      };
      this.service.createPost(post)
            .subscribe( response => {
              console.log(response.json());
            },
            (error:Response) => {
              if(error instanceof BadInputError)
                alert('Bad input error!');
            });
      this.posts.push(post);
    }
    title.value='';
  }

  public updatePost(post){
    console.log('Update in process...');
  }

  public deletePost(post){

    let index = this.posts.indexOf(post);

    this.posts.splice(index,1);
    console.log(this.posts);
    this.service.deletePost(post.id).subscribe(
      response => {
        console.log(response.json());
      },
      (error:AppError) => {
        if(error instanceof NotFoundError)
          alert('The post has already been deleted');
        alert('An error has occured!');
      }
    );

  }

  ngOnInit(){
    console.log(this.posts);
    this.service.getPosts().subscribe(response => {
                                           this.posts = response.json();
                                        },
                                        (error: Response) => {
                                          if(error.status === 404){
                                              alert('This post has already been deleted!');
                                          }else{
                                            alert('An unexpected error occured!');
                                          }
                                        });
  }


}
