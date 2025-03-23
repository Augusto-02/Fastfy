export class Resource<T = object> {
  constructor(protected data: T, protected meta?: any) {
    this.data = data;
    this.meta = meta;
  }
  toJson() {
    return {
      data: this.data,
      meta: this.meta ? { meta: this.meta } : {},
    };
  }
}

export class ResourceCollections<T> extends Resource<T[]> {
  constructor(
    data: T[],
    meta?: { paginationData?: { page: string; limit: number } }
  ) {
    super(data, meta);
  }

  toJson() {
    const { paginationData, ...otherData } = this.meta || {};
    const meta = {
      ...otherData,
      current_page: paginationData.page,
      limit: paginationData.limit,
    };
    return {
      data: this.data,
      meta,
    };
  }
}
