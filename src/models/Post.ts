export interface PostDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface PostDBWithCreatorName {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator_name: string;
}

export interface PostModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface likeDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED",
}

export class Post {
  constructor(
    private id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private created_at: string,
    private updated_at: string,
    private creatorId: string,
    private creatorName: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
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

  public getCreatedAt(): string {
    return this.created_at;
  }

  public setCreatedAt(value: string): void {
    this.created_at = value;
  }

  public getUpdatedAt(): string {
    return this.updated_at;
  }

  public setUpdatedAt(value: string): void {
    this.updated_at = value;
  }

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

  public toDBModel(): PostDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      creator: {
        id: this.creatorId,
        name: this.creatorName,
      },
    };
  }
}
