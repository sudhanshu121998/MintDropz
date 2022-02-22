MintDropz-Task

Steps to run/use apis
1) Clone the git repo
2) Run npm install to install the required package
3) Afer successful completion run nodemon index.js
4) In db.js change the mongodb url(for testing purpose)
5) By using postman hit the api in given sequence (as mentioned user should be logged in for performing operation on POST)
    A) Create User Api: POST Method "/api/auth/createuser"
    B) Login User Api : POST Method "/api/auth/login" get the auth-token in response and paste in header hereafter (key:auth-token)
    ****Add Header as key:auth-token and value: response from login api
    C) Add Post Api   : POST Method "/api/posts/addpost" (pass the title and description)
    D) Get All Post Api : GET Method "/api/posts/fetchallposts"
    E) Get PostByID Api : GET Method "/api/posts/fetchpost/:id" (give the id of post)
    F) Update a Post Api: PUT Method "/api/posts/updatepost/:id" (pass the changes if any)
    G) Delete a Post Api: DELETE Method "/api/posts/deletenote/:id" (give id of post to be deleted)
--------------------------------------------------------------------------------------------