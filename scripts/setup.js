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
const SnC = require("../main")
const BigNumber = require("bignumber.js")

const pk1 = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
const pk2 = "0xb9468b2008db8ce26bde5839adec29da17c1b7806eb6dee4c1383e61f4f18ba3"

const snc = new SnC("local", pk1)

const mintAmount = new BigNumber(1000).multipliedBy("1e18").toString(10)

snc.eurToken.mint("0xE56eE3E9B497cf729EdAD0Ab5f93fEC419224F78", mintAmount).then(async tx => {
    await tx.wait() && console.log("minted 1000 tokens")
    
    const sncMSP = new SnC("local", pk2)

    console.log("eurToken:", snc.eurToken.address)

    await sncMSP.eurToken.provision(1000, "0xE56eE3E9B497cf729EdAD0Ab5f93fEC419224F78")
    // await sncMSP.eurToken.provision(new BigNumber(10).multipliedBy("1e18").toString(10), "0x27C43eD4149d87784bca7F2D0F2791A8f414F034")
    console.log("provisioned 1000 tokens")

    // const cdrID = "77a26676-b55b-44f5-a334-f3d3a6d7ceb6"
    // const recipient = "0x27C43eD4149d87784bca7F2D0F2791A8f414F034"
    // const amount = 1
    // const token = "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6"

    // const sig = await sncMSP.getSignedTransfer(cdrID, recipient, amount, token)

    // await sncMSP.transfer(cdrID, recipient, amount, token, sig)
    // console.log("transfered")
})
