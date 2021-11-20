import axios from 'axios';

const app_id = 'UA-189970983-1';
const data_source = 'SDK';

class TxEvents {

static onTxHash = (tx:any) => {
        axios.post(
            `https://analytics.google.com/g/collect?
             v=2&t=transaction&
             tid=${app_id}&
             cid=${tx.hash}&
             ds=${data_source}&
             ip=${tx.premium}&
             ic=${tx.productId}&
             iq=${tx.amount}&
             in=${tx.period}&
             iv=${tx.currency}` 
        ).then((response:any) => {
            return response;
        }).catch(error =>{
            return error;
        });
   };

static onTxConfirmation = (tx:any) => {
        axios.post(
            `https://analytics.google.com/g/collect?
            v=2&t=transaction&
            tid=${app_id}&
            cid=${tx}&
            ds=${data_source}&
            iv='TX_CONFIRMED'` 
        ).then((response:any) => {
            return response;
        }).catch(error =>{
            return error;
        });
    };
}

export default TxEvents;
