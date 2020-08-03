import mongoose from 'mongoose'
import { UserModel } from './models/user';
import { BlueprintModel } from './models/blueprint';


import { ImageSource } from '../../../blueprintnotincluded-lib';
import * as fs from 'fs';

export class Database
{
  dbURI = 'mongodb://localhost:27017/blueprintnotincluded';

  constructor()
  {
    mongoose.connect(this.dbURI, {
      useNewUrlParser:true, 
      useUnifiedTopology: true,
      useCreateIndex: true}).catch( (reason) => {
        console.log('Mongoose connection error: ' + reason);
      });;
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to ' + this.dbURI);
      UserModel.init();
      BlueprintModel.init();

      /*
      require('jsdom-global')()
      for (let k of ImageSource.keys) {
        let imageUrl = ImageSource.getUrl(k)!;
        fs.readFile(imageUrl, 'binary', function(error, data) {
          var buf = new Buffer(data, 'binary');
          var datastring = buf.toString('base64');

          let img = window.document.createElement("img");
          img.src = "data:image/png;base64,"+datastring;
          window.document.body.appendChild(img);
          //ImageSource.setUrl(k, "data:image/png;base64,"+datastring);
          ImageSource.getBaseTextureElement(k, img);
          console.log(k)
        });
      }
      */

    });
    
    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

  }


}