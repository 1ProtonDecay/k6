import http from 'k6/http';
import { sleep } from 'k6';
import * as config from './config.js';

export const options =
{
    vus:100, //виртуальные пользователи
    duration: '300s', // продолжительность теста
    thresholds: { //критерий успеха/провала, используемый для указания ожиданий от производительности системы, успех теста зависит от этой проверки
        http_req_duration: ['p(95) < 2000'], //95% запросов должны быть выполнены за 2 сек.
        http_req_failed: ['rate < 0.1'] //доля ошибочных запросов должна быть менее 10%
    },
}

export default function ()
{
  http.get(config.API_ENDPOINT, 
    {
      headers: 
      {
        accept: 'application/json',
        authorization: config.API_Token
      }
  }
  );
}
sleep(2); //приостановить выполнение vus на указанный срок