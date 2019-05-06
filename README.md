# quickNotes

quickNotes is a clean blogging site developed using Node and Semantic UI, primarily to allow users to share quick notes or facts with accompanying image.

## Live site

[https://quickn.herokuapp.com/blogs]()

## Installation

Use the package manager npm to install dependencies.

```bash
npm install body-parser
npm install ejs
npm install express
npm install express-sanitizer
npm install method-override
npm install mongoose
```

## Running the application

Upon successfully unzipping the code and installation of the dependencies, run the following command and head over to http://localhost or http://localhost:3000

```python
node app.js
```

## Connecting to MongoDB

To be able to add and modify post, the application needs to be connected to MongoDB. Head over to [MongoDB](https://www.mongodb.com/download-center/community) to install on local machine. Upon successful installation and configuring, modify the MONGODB URL in app.js

```
mongoose.connect("<MONGODB URL>", { useNewUrlParser: true });
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
