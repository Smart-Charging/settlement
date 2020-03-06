const ethers = require('ethers')
const contracts = require('./lib/contracts')
const sign = require('./lib/signTransfer')
const {networks} = require('./networks')
const {toBN} = require('./lib/utils')
const BigNumber = require('bignumber.js')

class SnC {
  constructor(network, privateKey, provider) {
    if (!contracts[network]) throw new Error(`the network ${network} does not exist`)
    if (!provider) {
      provider = new ethers.providers.JsonRpcProvider(`${networks[network].protocol}://${networks[network].host}:${networks[network].port}`)
    }
    this.provider = provider
    this.wallet = new ethers.Wallet(privateKey, provider)
    this.settlementJson = contracts[network].Settlement
    this.eurTokenJson = contracts[network].EurToken
    this.usdTokenJson = contracts[network].UsdToken
    this.chfTokenJson = contracts[network].ChfToken
    this.erc20Json = contracts[network].ERC20

    this.settlement = new ethers.Contract(this.settlementJson.address, this.settlementJson.abi, this.wallet)
    this.eurToken = new ethers.Contract(this.eurTokenJson.address, this.eurTokenJson.abi, this.wallet)
    this.usdToken = new ethers.Contract(this.usdTokenJson.address, this.usdTokenJson.abi, this.wallet)

    if (this.chfTokenJson) {
      this.chfToken = new ethers.Contract(this.chfTokenJson.address, this.erc20Json.abi, this.wallet)
    }

    this.tokensDict = {
      "EUR": this.eurToken,
      "USD": this.usdToken,
      "CHF": this.chfToken
    }

    this.eurToken.provision = async (amount, recipient) => {
      return this.provisionPaymentTokens(this.eurToken, amount, recipient)
    }
    this.usdToken.provision = async (amount, recipient) => {
      return this.provisionPaymentTokens(this.usdToken, amount, recipient)
    }
  }

  async provisionPaymentTokens(token, amount, recipient) {
    try {
      amount = new BigNumber(amount).multipliedBy("1e18").toString(10)
      const approval = await token.approve(this.settlement.address, amount)
      await approval.wait()
      const provision = await this.settlement.transferInto(recipient ? recipient : this.wallet.address, amount, token.address)
      return provision.wait()
    } catch (e) {
      throw e
    }
  }

  async getSignedTransferRaw(cdrId, recipient, amount, currency) {
    const token = this.getTokenContract(currency)
    return sign(cdrId, recipient, amount, token.address, this.wallet)
  }

  async getSignedTransfer(cdrId, recipient, amount, currency) {
    amount = new BigNumber(amount).multipliedBy("1e18").toString(10)
    console.log("signing amount:", amount)
    return this.getSignedTransferRaw(cdrId, recipient, amount, currency)
  }

  async transfer(cdrId, recipient, amount, currency, signature) {
    amount = new BigNumber(amount).multipliedBy("1e18").toString(10)
    const token = this.getTokenContract(currency)
    const tx = await this.settlement.transfer(
      cdrId,
      recipient,
      amount,
      token.address,
      signature.v,
      signature.r,
      signature.s,
      {gasLimit: 1000000})
    await tx.wait()
    const receipt = await this.provider.getTransactionReceipt(tx.hash)
    if (receipt.status === 0) {
      const setllementBalance = await this.settlement.tokenBalances(token.address, this.wallet.address)
      if (setllementBalance.lt(toBN(amount).toString(10))) {
        throw new Error(`the transfer failed because of a lack of funds sender has ${setllementBalance.toString()} but needs ${toBN(amount).toString()}`)
      } else {
        throw new Error('the transfer failed for an unknown reason. probably the signature could not be verified')
      }
    }
    return tx.hash
  }

  getTokenContract(currency) {
    try {
      let token
      if (currency.length === 3) {
        token = this.tokensDict[currency.toUpperCase()]
      } else {
        // won't throw if contract doesn't exist but will log the error
        token = new ethers.Contract(currency, this.erc20Json.abi, this.wallet)
      }
      if (!token) {
        throw Error("Currency/address does not exist")
      }
      return token
    } catch (err) {
      throw Error("Failed to get token contract: " + err)
    }
  }

}

module.exports = SnC
