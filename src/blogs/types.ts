export type CreateBlog = {
	userId: number
	title: string
	content: string
	groupId?: number
}

export type UpdateBlog = {
	blogId: number
	title: string
	content: string
}

export enum BlogStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED',
	DELETED = 'DELETED',
}
