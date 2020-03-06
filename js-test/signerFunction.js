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

const privateKeys = {
  poa: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  local: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  tobalaba: '0xCAB468AF941365618E45836E3C4E08F53A330C87C37941F011F68BA3D448C47B'
}
// const privateKey = '0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7'
const network = 'tobalaba'
const snc = new SnC(network, privateKeys[network])

async function run() {
  console.log(
    'wallet address', snc.wallet.address,
    'total supply', (await snc.eurToken.totalSupply()).toString(),
    'start balance', (await snc.eurToken.balanceOf(snc.wallet.address)).toString()
  )

  const amount = toBN('3.94e18').toString()
  const mint = await snc.eurToken.mint(snc.wallet.address, amount)
  if((await snc.settlement.tokenBalances(snc.eurToken.address, snc.wallet.address)).lt(amount)){
    const provision = await snc.eurToken.provision(amount)
  }
  console.log('balance after provisioning', (await snc.eurToken.balanceOf(snc.wallet.address)).toString())
  console.log(
    'settlement balance after provisioning',
    (await snc.settlement.tokenBalances(snc.eurToken.address, snc.wallet.address)).toString(),
    (await snc.eurToken.balanceOf(snc.wallet.address)).toString(),
    (await snc.eurToken.balanceOf(snc.settlement.address)).toString()
  )

  const cdrId = 'ee231ae9-4b34-44d0-abe6-ea0dfbd0e4f6'
  const recipient = '0xf17f52151ebef6c7334fad080c5704d77216b732'
  // const recipient = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'

  // const sig = await snc.getSignedTransferRaw(cdrId, recipient, toBN(amount), 'EUR')
  // console.log(sig.r, sig.s, sig.v)
  // await snc.transfer(cdrId, recipient, toBN(amount), 'EUR', sig)
  const s2 = await snc.getSignedTransfer(cdrId, recipient, 0.81, 'EUR')
  console.log(s2.r, s2.s, s2.v)
  await snc.transfer(cdrId, recipient, 0.81, 'EUR', s2)

  console.log(
    'settlement balance after transfer',
    'recipient:',
    (await snc.eurToken.balanceOf(recipient)).toString(),
    'provision for sender:',
    (await snc.settlement.tokenBalances(snc.eurToken.address, snc.wallet.address)).toString(),
    'tokens in settlement contract',
    (await snc.eurToken.balanceOf(snc.settlement.address)).toString()
  )
}

run()
  .then(console.log)
  .catch(console.error)
