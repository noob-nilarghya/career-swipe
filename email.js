const nodemailer= require('nodemailer'); // this package helps to send email with the help of node.js
const ejs= require('ejs');
const htmlToText= require('html-to-text'); // convert HTML --> Text

// We want to make generic email handler. So,
module.exports= class Email{
    constructor(user, url){
        this.to= user.email; 
        this.firstName= user.username.split(' ')[0]; // first name for personalised email
        this.url= url;
        this.from= process.env.EMAIL_FROM;
    }

    newTransport(){
        if(process.env.NODE_ENV === 'production'){
            const transporter= nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            return transporter;
        }
        else{
            const transporter= nodemailer.createTransport({
                host: process.env.MAILTRAP_HOST,
                port: process.env.MAILTRAP_PORT,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PWD
                }
            });

            return transporter;
        }
        
    }

    async send(template, subject){

        // render HTML based on pug template (this is basically non-server rendering)
        const html= await ejs.renderFile(`${process.cwd()}/email_template/${template}.ejs`, {
            // This will replace all #{firstName} with this.firstName on template.pug and so on
            firstName: this.firstName,
            url: this.url,
            subject: subject
        });

        // define email options
        const mailOptions = {
            from: this.from,
            to: this.to, // reciever email
            subject: subject,
            html: html,
            text: htmlToText.convert(html) 
        };

        // create transport and send email
        await this.newTransport().sendMail(mailOptions, (error, info) =>{
            if(error){ return new Error("There is an issue sending mail"); }
            console.log("Mail sent bro!");
        });
    }

    // Now with above template we can send mail for multiple purposes like 'welcome' email for sign up. OR 'password' reset email etc
    async sendWelcome(){ // this will send welcome mail. Now we need link this to 'authController.signup' (see signup)
        await this.send('welcomeEmail', 'Welcome to Career-Swipe!🙏');
    }

    async sendPasswordReset(){
        await this.send('pwdReset', '!!! RESET PASSWORD !!!   Valid for 10 minutes');
    }

    async sendNewMatch(){
        await this.send('newMatch', 'Yay! You found a new match');
    }
};