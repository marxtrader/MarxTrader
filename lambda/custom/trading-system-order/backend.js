'use strict';

const request = require('superagent');
const config = require('./config');

let sessionCookies;

const getFirstCookie = res => {
  const cookies = res.headers['set-cookie'];
  if(!cookies) return null; 
  const cookie = cookies[0];
  if(!cookie) return null; 
  return cookie.substr(0, cookie.indexOf(';'));
};

module.exports.doLogin = () => {
  return new Promise( (resolve, reject) => {
    request.get(config.dataMgmtUrl)
      .withCredentials()
      .timeout(5000)
      .then( getFirstCookie )
      .then( sessionCookie => {
        const encUsername = encodeURIComponent(config.username)
        const encPassword = encodeURIComponent(config.password)
        const qstring = `username=${encUsername}&password=${encPassword}`
        request.get(config.loginUrl + qstring)
          .withCredentials()
          .timeout(5000)
          .redirects(1)
          .then( res => {
            sessionCookies = sessionCookie+'; '+getFirstCookie(res);
            resolve(sessionCookies);
          });
      })
      .catch( err => {
        console.log('--- error in doLogin');
        console.log(err);
        reject(err);
      });
  });
};

module.exports.placeOrder = (order) => {
  return new Promise( (resolve, reject) => {
    request.post(config.orderMgmtRestUrl+'orders/place')
      .timeout(5000)
      .withCredentials()
      .set('Accept', '*')
      .set('Content-Type', 'application/json')
      .set('Cookie', sessionCookies)
      .send(order)
      .then( res => {
        resolve(res.body)
      })
      .catch(err => {
        console.log('place error', err)
        reject()
      })
  })
}

module.exports.setMessageType = () => {
  return new Promise( (resolve, reject) => {
    request.get(config.orderMgmtRestUrl+'orders/eventsource/USER')
      .timeout(5000)
      .withCredentials()
      .set('Accept', '*')
      .set('Cookie', sessionCookies)
      .then( res => {
        if(res.status != 204) {
          reject()
        } else {
          resolve()
        }
      })
      .catch(err => {
        console.log('setMessageType', err)
        reject()
      })
  })
}
module.exports.getMessages = () => {
  return new Promise( (resolve, reject) => {
    request.get(config.orderMgmtRestUrl+'orders/events')
      .timeout(5000)
      .withCredentials()
      .set('Accept', '*')
      .set('Cookie', sessionCookies)
      .then( res => { resolve(res.body) })
      .catch(err => {
        console.log('getMessages', err)
        reject()
      })
  })
}
