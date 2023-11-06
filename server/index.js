const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const JWT_CODE = "sdjknalksjdnjdflj8378343kajnsdjn&*^sdlfkjsdlfksdfkj"

const url = 'mongodb://127.0.0.1:27017/MyDissertation';
const dbName = 'MyDissertation';
var nodemailer = require('nodemailer');

mongoose.connect(url, {
    useNewUrlParser: true, useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    else {
        console.log('Connected to MongoDB successfully');
    }
}
)

mongoose.set("strictQuery", false);

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '6469ed44f9828100134be704',
            'PLAID-SECRET': '3711225984486d01fb7eb13c61eee8',
        },
    },
});

const plaidClient = new PlaidApi(configuration);
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const userSchema = new mongoose.Schema({
    title: String,
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

app.post('/mongoDB/postData', async (request, response) => {

    try {
        const { title, name, email, password, mPassword } = request.body;
        const encryptedPwd = await bcrypt.hash(password, 10)

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            response.json({ message: 'User Already Exists' })
        }
        else {
            const newUser = new User({
                title,
                name,
                email,
                password: encryptedPwd,
            });
           
            await newUser.save();
            response.json({ message: 'Congratulations. You are now Registered.' });
        }
    } catch (error) {
        console.error('Error saving user:', error);
        response.status(500).json({ error: "Server Error - Failed to save user. Please Try Again Later" });
    }
}); 

app.post('/mongoDB/getData', async (request, response) => {

    try {
        const { email, password } = request.body;

        const oldUser = await User.findOne({ email });

        if (!oldUser) {
            return response.json({ error: 'User Does Not Exists. Please Register.' })
        }
        if (oldUser && await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign({ email: oldUser.email }, JWT_CODE, {
                expiresIn: "30m"
            })
            // console.log("inside success")
            return response.json({ status: "ok. Login Accepted", data: token })
        } else {
            return response.json({ status: "error", error: "Incorrect Password. Please Try Again." })
        }
    } catch (error) {
        return response.status(500).json({ error: 'Internal Server Error. Please Try Again' });
    }
});

app.post('/verifySessionToken', async (request, response) => {
try {
    const {loginToken} = request.body;
    jwt.verify(loginToken, JWT_CODE, (error, decoded) => {
        if (error) {
          console.error('Token verification failed:', error);
          response.status(401).json({ message: 'Token verification failed' });
        } else {
        //   console.log('Token verification successful');
          response.status(200).json({ message: 'Token verification successful', decoded });
        }
    });
}
catch (error) {
        return response.status(500).json({error: 'Server Error'})
    }
});

app.post('/mongoDB/forgotPassword', async (request, response) => {

    try {
        const { email } = request.body;
        const oldUser = await User.findOne({ email });

        if (!oldUser) {
            return response.json({ error: 'User Does Not Exists. Please Register.' })
        }

        const secret = JWT_CODE + oldUser.password
        const fp_token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '15m', })
        const fp_link = `http://localhost:8000/resetpassword/${oldUser._id}/${fp_token}`
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'pranavram28061992@gmail.com',
              pass: 'hodxexmteikwicyg'
            }
          });
        var mailOptions = {
            from: "youremail@gmail.com",
            to: oldUser.email,
            subject: "Password Reset - FinStir",
            text: `Hi There,

 Greetings from FinStir. Please click the following link to set your new password. 
 
 ${fp_link}. 
 
 Thanks for Using our App. Happy Banking.`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
                return response.send(info)
            }
        });
    }

    catch (error) {
        response.status(500).send("Error")
    }
});

app.get('/resetpassword/:id/:fp_token', async (request, response) => {
    const { id, fp_token } = request.params;
    console.log(request.params)

    const oldUser = await User.findOne({ _id: id })
    if (!oldUser) {
        return response.json({ status: "User not found" });
    }
    const secret = JWT_CODE + oldUser.password;
    try {
        const verify = jwt.verify(fp_token, secret);
        // response.json("verified")
        response.render("index", { email: verify.email, status: "Not Verified" })
    }
    catch (error) {
        response.status(500).send("Error")
    }
});

app.post('/resetpassword/:id/:fp_token', async (request, response) => {
    const { id, fp_token } = request.params;
    const { password } = request.body

    const oldUser = await User.findOne({ _id: id })
    if (!oldUser) {
        return response.json({ status: "User not found" });
    }
    const secret = JWT_CODE + oldUser.password;
    try {
        const verify = jwt.verify(fp_token, secret);
        const encryptedPwd = await bcrypt.hash(password, 10);
        await User.updateOne({
            _id: id,
        },
            {
                $set: {
                    password: encryptedPwd
                },
            })
        console.log("success")
        response.render("index", { email: verify.email, status: "verified" })
    }
    catch (error) {
        response.status(500).send("Error")
    }
});

app.post('/link/token/create', async function (request, response) {

    try {
        const plaidRequest = request.body;
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        response.status(500).send("failure");
    }
});

app.post("/auth", async function (request, response) {
    try {
        const access_token = request.body.access_token;
        const plaidRequest = {
            access_token: access_token,
        };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        response.json(plaidResponse.data);
    } catch (e) {
        response.status(500).send("failed");
    }
});

app.post('/item/public_token/exchange', async function (
    request,
    response,
    next,
) {
    const publicToken = request.body.public_token;
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = plaidResponse.data.access_token;
        response.json({ accessToken });
    } catch (error) {
        response.status(500).send("failed");
    }
});

app.post('/accounts/balance/get', async function (request, response) {
    try {
        const access_token = request.body.access_token;
        const plaidRequest = {
            access_token: access_token,
        };
        const plaidResponse = await plaidClient.accountsBalanceGet(plaidRequest);
        response.json(plaidResponse.data);
    } catch (error) {
        // handle error
        response.status(500).send("failed")
    }
}
);

app.post('/transactions/get', async function (request, response) {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(d.getDate()).padStart(2, '0');
    const eDate = `${year}-${month}-${day}`;
    const sDate = `${year - 1}-${month}-${day}`;

    try {
        const access_token = request.body.access_token;
        // console.log(access_token)
        const plaidRequest = {
            access_token: access_token,
            start_date: sDate,
            end_date: eDate,
            options: {
                include_personal_finance_category: true
            }
        };
        const plaidResponse = await plaidClient.transactionsGet(plaidRequest);
        //response.json(plaidResponse.data)
        let transactions = plaidResponse.data.transactions;
        const total_transactions = plaidResponse.data.total_transactions;
        while (transactions.length < total_transactions) {
            const plaidPaginatedRequest = {
                access_token: access_token,
                start_date: sDate,
                end_date: eDate,
                options: {
                    offset: transactions.length,
                    include_personal_finance_category: true
                },
            };
            const plaidPaginatedResponse = await plaidClient.transactionsGet(plaidPaginatedRequest);
            transactions = transactions.concat(
                plaidPaginatedResponse.data.transactions,
            );
        }
        return response.json(transactions)
    } catch (error) {
        response.status(500).send("failed")
    }
});

app.post('/transfer/intent/create', async function (request, response) {

    try {
        const plaidRequest = request.body; 
        const plaidResponse = await plaidClient.transferIntentCreate(plaidRequest);
        response.json(plaidResponse.data);
    } catch (error) {
        console.error(error);
        response.status(500).send("failed")
    }
});

app.post('/transfer/intent/get', async function (request, response) {

    const transferid = request.body.transfer_id;
    try {
        const plaidRequest = {
            transfer_intent_id: transferid,
        };
        const plaidResponse = await plaidClient.transferIntentGet(plaidRequest);
        response.json(plaidResponse.data);
    }
    catch (error) {
        console.error(error);
        response.status(500).send("failed")
    }
})

app.listen(8000, () => {
    console.log("server has started");
});