import express, { Application } from 'express';
import expressJwt from 'express-jwt';
import fs from 'fs';
import path from 'path';
import { BlueprintController } from "./api/blueprint-controller";
import { DuplicateCheckController } from "./api/duplicate-check-controller";
import { LoginController } from './api/login-controller';
import { RegisterController } from "./api/register-controller";

const Recaptcha = require('express-recaptcha').RecaptchaV3;

export class Routes {
  public loginController = new LoginController();
  public registerController = new RegisterController();
  public duplicateCheckController = new DuplicateCheckController();
  public uploadBlueprintController = new BlueprintController();
  public PUBLIC: string;
  public availableLanguages: string[];

  constructor() {
    this.PUBLIC = process.env.PUBLIC_DIR || path.join(__dirname, "public");
    this.availableLanguages = fs.readdirSync(this.PUBLIC);
  }

  selectLang(accepts: string[]) {
    for (const lang of accepts)
      if (lang in this.availableLanguages)
        return lang

    for (const lang of accepts)
      for (const aLang of this.availableLanguages)
        if (lang.split('-')[0] === aLang.split('-')[0])
          return aLang
    return 'en-US'
  }

  public routes(app: Application): void {
    // Initialize authentification middleware
    //let auth = expressJwt({secret: process.env.JWT_SECRET as string, userProperty: 'tokenPayload' });
    let auth = expressJwt({
      secret: process.env.JWT_SECRET as string,
      algorithms: ['HS256'],
    });

    if (process.env.ENV_NAME == 'development') {
      console.log('Initializing routes without recaptcha verification');
      app.route("/api/login").post(this.loginController.login);
      app.route("/api/register").post(this.registerController.register);
    }
    else {
      let recaptcha = new Recaptcha(process.env.CAPTCHA_SITE as string, process.env.CAPTCHA_SECRET as string);
      console.log('Initializing routes with recaptcha verification');
      app.route("/api/login").post(recaptcha.middleware.verify, this.loginController.login);
      app.route("/api/register").post(recaptcha.middleware.verify, this.registerController.register);
    }

    // Anonymous access
    app.route("/api/checkusername").get(this.duplicateCheckController.checkUsername);
    app.route("/api/getblueprint/:id").get(this.uploadBlueprintController.getBlueprint);
    app.route("/api/getblueprintmod/:id").get(this.uploadBlueprintController.getBlueprintMod);
    app.route("/api/getblueprintthumbnail/:id").get(this.uploadBlueprintController.getBlueprintThumbnail);
    app.route("/api/getblueprints").get(this.uploadBlueprintController.getBlueprints);

    // Logged in access
    app.route("/api/getblueprintsSecure").get(auth, this.uploadBlueprintController.getBlueprints);
    app.route("/api/uploadblueprint").post(auth, this.uploadBlueprintController.uploadBlueprint);
    app.route("/api/likeblueprint").post(auth, this.uploadBlueprintController.likeBlueprint);
    app.route("/api/deleteblueprint").post(auth, this.uploadBlueprintController.deleteBlueprint);

    app.use(express.static(this.PUBLIC));
    app.get('*', (req, res) => {
      console.log(this.PUBLIC)
      res.sendFile(path.join(this.PUBLIC, this.selectLang(req.acceptsLanguages()), 'index.html'));
    });
  }
}
