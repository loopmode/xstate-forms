export const apiClient = /* axios.createInstance() */ {
  post: (url: string, data: unknown) => {
    console.log("post", url, data);
    return new Promise((resolve) => setTimeout(resolve, 3000));
  },
};
