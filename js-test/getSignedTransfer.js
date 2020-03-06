/*
    Copyright 2020 Smart Charging Solutions

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
const SnC = require('../main')

const privateKeys = {
  local: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  tobalaba: '0xCAB468AF941365618E45836E3C4E08F53A330C87C37941F011F68BA3D448C47B'
}
const network = 'local'
const snc = new SnC(network, privateKeys[network])
const cdrId = '50af3e2b-7382-454c-9f5d-88a037128045'
const recipient = '0xf17f52151ebef6c7334fad080c5704d77216b732'

const run = async () => {
  return snc.getSignedTransfer(cdrId, recipient, 10.44, 'EUR')
}

run()
  .then(res => console.log(res.r, res.s, res.v))
  .catch(console.error)
