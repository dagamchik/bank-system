import './scss/style.scss';
import Choices from 'choices.js';
import '../node_modules/choices.js/src/styles/choices.scss';
import createDomMainPage from './js/main-page';
import { el, mount, setChildren } from 'redom';
import createDomAccountPage from './js/check-page';
import axios from 'axios';
import Navigo from 'navigo';

const router = new Navigo('/');


const API_BASE_URL = 'http://localhost:3000'
const mainLogin = 'developer';
const mainPass = 'skillbox';
let token;

router.on('/', () => {
    setChildren(document.body, createDomMainPage());

    const btnAuth = document.querySelector('.main__auth-btn');
    const link = document.querySelector('.main__auth-link');
    
    
    function auth(loginInput, passInput) {
        return axios.post(API_BASE_URL + '/login', {
            login: `${loginInput.value}`,
            password: `${passInput.value}`
        })
    }

    function goToPage(event) {
        router.navigate(event.target.getAttribute('href'));
    }
    
    btnAuth.addEventListener('click', async function (e) {
        e.preventDefault();
        const loginInput = document.querySelector('.login');
        const passInput = document.querySelector('.password');
    
        if (loginInput.value === mainLogin) {
            if (passInput.value === mainPass) {
                    await axios.post(API_BASE_URL + '/login', {
                        login: `${loginInput.value}`,
                        password: `${passInput.value}`
                    })
                    .then((response) => {
                        token = response.data.payload.token;
                        goToPage(e)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                auth(loginInput, passInput)
                .then((response) => {
                    alert(response.data.error)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        } else {
            auth(loginInput, passInput)
            .then((response) => {
                alert(response.data.error)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })


})

async function getInfoAccount() {
    return await axios.get(API_BASE_URL + '/accounts', {
        headers: {
            'Authorization': `Basic ${token}`
        }
    })
    .then((res) => {
        return res.data.payload;
    })
}

router.on('/account', async () => {
    let data = await getInfoAccount();

    setChildren(document.body, createDomAccountPage(data));

    const element = document.querySelector('.default');
    const choices = new Choices(element, {
        searchEnabled: false,
    });

    const createNewCheck = document.querySelector('.check__top-right-link');
    createNewCheck.addEventListener('click', async function(e) {
        e.preventDefault();
        await axios.post(API_BASE_URL + `/create-account`, {
            headers: {
                'Authorization': `Basic ${token}`,
            }
        })
            .then((res) => {
                console.log(res);
            })
        let data = await getInfoAccount();
        console.log(data)
    
        setChildren(document.body, createDomAccountPage(data));
    })
})

router.resolve();