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
                    margin: 0;
                    padding: 0;
                    background: #e0e0e0;
                }
        
                .container {
                    width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden; /* To contain floated elements */
                }
        
                header {
                    background-color: #333;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                }
        
                header a {
                    color: #fff;
                    text-decoration: none;
                }
        
                h1 {
                    font-size: 24px;
                    margin: 0;
                }
        
                .content {
                    padding: 30px;
                }
        
                p {
                    color: #555555;
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
        
                .code {
                    text-decoration: none;
                    color: #fff;
                    font-weight: bold;
                    font-size: 24px;
                    background-color: #333;
                    padding: 10px 20px;
                    border-radius: 4px;
                    display: inline-block; /* Adjust for better positioning */
                    margin-bottom: 15px; /* Add spacing */
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
        
                .code:hover {
                    background-color: #444;
                    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
                }
        
                footer {
                    background-color: #f5f5f5;
                    padding: 20px;
                    text-align: center;
                }
        
                footer a {
                    color: #999999;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <header>
                <a href="https://www.bujafood.com"><img src="logo.png" alt="BujaFood Logo" width="150"></a>
            </header>
            <div class="container">
                <div class="content">
                    <h1>${format.title}</h1>
                    <p>${format.description}</p>
                    <p class="code">${format.code}</p>
                    <p>Merci,</p>
                    <p>L'équipe de BujaFood Marketing Inc</p>
                </div>
                <footer>
                    <p>Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                    <p><a href="https://www.bujafood.com">BujaFood</a></p>
                </footer>
            </div>
        </body>
        </html>
        `;
    return mailContent;
};

export default emailFormat;