'use strict'
console.log('connect!!!');
const author = document.querySelector('.author');
const error = document.querySelector('.error');
const login = document.querySelector('.login');
const password = document.querySelector('.password');
const signIn = document.querySelector('.sign-in');
const test = document.querySelector('.create');
let body = {}

signIn.addEventListener('click', async ()=>{
    body={
        login:login.value,
        password:password.value,
    }
    try {
        const res = await fetch('/api/auth/sign-in',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
        });
        if (res.status>=400) throw new Error ('ошиипко!');
        const auth = await res.json()
        author.textContent=`${auth.user.login} - ${auth.user.name}`
    } catch (err) {error.textContent=err}
    
});
test.addEventListener('click', async ()=>{
    try {
        const res = await fetch('api/user',{credentials:'include'});
        if (res.status>=400) throw new Error ('ошиипко!');
        const list = await res.json();
        console.log(list);
    } catch (err) {error.textContent=err}
})
