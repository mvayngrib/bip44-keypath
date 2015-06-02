// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#examples

var PARTS = ['coin', 'account', 'chain', 'address']
var REGEX = /^m\s*\/\s*44\'\s*\/\s*(\d+)\'\s*\/\s*([0,1]+)\'\s*\/\s*(\d+)\s*\/\s*(\d+)$/

module.exports = KeyPath
exports.CHAINS = {
  external: 0,
  internal: 1
}

function KeyPath(coin) {
  assert('bip44' in coin)
  this._coin = coin
}

KeyPath.prototype.account = function(account) {
  assert(typeof account === 'number')
  this._account = account
  return this
}

KeyPath.prototype.chain = function(chain) {
  assert(chain in exports.CHAINS)
  this._chain = chain
  return this
}

KeyPath.prototype.address = function(addressIdx) {
  assert(typeof addressIdx === 'number')
  this._address = addressIdx
  return this
}

KeyPath.prototype.build = function() {
  assert(PARTS.every(function(p) {
    return ('_' + p in this) },
  this))

  return 'm/44\'' +
    this._coin.bip44 + '\'/' +
    this._account + '\'/' +
    this._chain + '/' +
    this._addressIdx
}

KeyPath.parse = function(keyPath) {
  var match = REGEX.exec(path)
  if (!match) throw new Error('invalid path')

  match = match.slice(1).map(Number)

  var coin
  for (var name in coininfo) {
    var c = coininfo[name]
    if (c.bip44 === parts[0]) {
      coin = c
      break
    }
  }

  if (!coin) throw new Error('unknown coin')

  return {
    coin: coin,
    account: parts[1],
    chain: parts[2] === 0 ? 'external' : 'internal',
    address: parts[3]
  }
}

KeyPath.forNextAddress = function(path) {
  if (!KeyPath.validate(path)) throw new Error('invalid path')

  var parts = path.split('/')
  parts[3] = Number(parts[3])++
  return parts.join('/')
}

KeyPath.validate = function(keyPath) {
  return REGEX.test(keyPath)
}
