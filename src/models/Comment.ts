export interface CommentDB {
  id: string;
  post_id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
}

export interface CommentDBWithCreatorName {
  id: string;
  post_id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  creator_name: string;
}

export interface CommentModel {
  id: string;
  postId: string;
  content: string;
  likes: number;
  dislikes: number;
  creator: {
    id: string;
    name: string;
  };
}

export interface likeDislikeCommentDB {
  user_id: string;
  comment_id: string;
  like: number;
}

export enum COMMENT_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED",
}

export class Comment {
  constructor(
    private id: string,
    private post_id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private creatorId: string,
    private creatorName: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }

  public getPost_id(): string {
    return this.post_id;
  }

  public setPost_id(value: string): void {
    this.post_id = value;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(value: string): void {
    this.content = value;
  }

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(value: number): void {
    this.likes = value;
  }

  public addLike = (): void => {
    this.likes++;
  };

  public removeLike = (): void => {
    this.likes--;
  };

  public getDislikes(): number {
    return this.dislikes;
  }

  public setDislikes(value: number): void {
    this.dislikes = value;
  }

  public addDislike = (): void => {
    this.dislikes++;
  };

  public removeDislike = (): void => {
    this.dislikes--;
  };

  public getCreatorId(): string {
    return this.creatorId;
  }

  public setCreatorId(value: string): void {
    this.creatorId = value;
  }

  public getCreatorName(): string {
    return this.creatorName;
  }

  public setCreatorName(value: string): void {
    this.creatorName = value;
  }

  public toDBModel(): CommentDB {
    return {
      id: this.id,
      post_id: this.post_id,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
    };
  }

  public toBusinessModel(): CommentModel {
    return {
      id: this.id,
      postId: this.post_id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      creator: {
        id: this.creatorId,
        name: this.creatorName,
      },
    };
  }
}
