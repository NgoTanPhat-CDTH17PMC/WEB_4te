import axios from 'axios';
import {GETDATAGETACTIONDATA} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getDataAction( targets = "",actionType="",page="",limit="",startDate="",endDate="") {
    var user_cookies = await getUserCookies();
        startDate = new Date(0).toISOString();
        endDate = new Date().toISOString();
    // console.log("user_cookies", user_cookies.user.parentRoot);
    let data;
    if (user_cookies) {
        let url = GETDATAGETACTIONDATA + `?targets=${targets}&actionType=${actionType}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
        //console.log("user_cookies",user_cookies);
        await axios.get(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    } else {
        return "Expired Token API";
    }
}

export default getDataAction;