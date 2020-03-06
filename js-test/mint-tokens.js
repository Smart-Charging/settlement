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
const ethers = require('ethers')
const {toBN} = require('../lib/utils')

const privateKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
// const privateKey = '0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7'
const snc = new SnC('local', privateKey)

async function run() {
  console.log(
    'wallet address', snc.wallet.address,
    'total supply', (await snc.eurToken.totalSupply()).toString(),
    'start balance', (await snc.eurToken.balanceOf(snc.wallet.address)).toString()
  )

  const amount = toBN('1e21').toString()
  await snc.eurToken.mint(snc.wallet.address, amount)

  console.log(
    'wallet address', snc.wallet.address,
    'total supply', (await snc.eurToken.totalSupply()).toString(),
    'end balance', (await snc.eurToken.balanceOf(snc.wallet.address)).toString()
  )
}

run()
  .then(console.log)
  .catch(console.error)
