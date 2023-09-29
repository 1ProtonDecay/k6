import http from 'k6/http';
import { sleep } from 'k6';
import * as config from './config.js';

export const options = {
  thresholds: 
  { //критерий успеха/провала, используемый для указания ожиданий от производительности системы, успех теста зависит от этой проверки
    http_req_duration: ['p(95) < 2000'], //95% запросов должны быть выполнены за 2 сек.
    http_req_failed: ['rate < 0.1'] //доля ошибочных запросов должна быть менее 10%
  },
  discardResponseBodies: true, //отменяет запись тела ответа, что снижает нагрузку на генератор и, возможно, дает более надежные результаты тестирования
  scenarios: {
    contacts: {
      executor: 'ramping-vus', //этот исполнитель хорошо подходит если нужно, чтобы vus увеличивались или уменьшались в определенные периоды времени
      startVUs: 25,
      stages: [
        { target: 25, duration: '30s' },  
        { target: 50, duration: '0s' },  
        { target: 50, duration: '30s' }, 
        { target: 75, duration: '0s' },
        { target: 75, duration: '30s' },
        { target: 100, duration: '0s' },
        { target: 100, duration: '60s' },
        { target: 0, duration: '20s' },
      ],
      gracefulRampDown: '0s', //"плавное торможение" выполнения потока vus
    },
  },
};

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