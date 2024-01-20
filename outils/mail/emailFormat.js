const emailFormat = (format) => {
    let mailContent =
        `<!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>${format.subject}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
                
                        body {
                            font-family: 'Montserrat', Arial, sans-serif;
                            padding: 20px;
                            border-radius: 50px;
                            background: #e0e0e0;
                            box-shadow:  45px 45px 57px #5a5a5a,
                                        -45px -45px 57px #ffffff;
                        }
                
                        .container {
                            background-color: #ffffff;
                            border-radius: 5px;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                        }
                
                        h1 {
                            text-align: center;
                            color: #333333;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                
                        p {
                            color: #555555;
                            line-height: 1.5;
                            margin-bottom: 15px;
                        }
                        .code {
                            text-decoration: none;
                            color: #fff;
                            font-weight: bold;
                            font-size: 24px;
                            background-color: #bdbdbd;
                            font-family: 'Montserrat', Arial, sans-serif;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-align: center;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                            transition: all 0.3s ease;
                        }
                        
                        .code:hover {
                            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
                        }
                
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #888888;
                            font-size: 14px;
                        }

                        .footer a {
                        color: #999999;
                        text-decoration: none;
                        }
                    </style>
            </head>
                <body>
                    <div class="container">
                        <h1>${format.title}</h1>
                        <p>${format.description}</p>
                        <p class="code">${format.code}</p>
                        <p>Merci,</p>
                        <p>L'équipe de la BujaFood Marketing Inc </p>
                        <div class="footer">
                            <p>Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                            <p><a href="https://www.bujafood.com">BujaFood</a></p>
                        </div>
                    </div>
                </body>
        </html>`;
    return mailContent;
};

export default emailFormat;