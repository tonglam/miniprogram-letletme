import https from './https'
import moment from 'moment'

function getDeadline(time) {
  return moment(time).utcOffset(-1 * new Date().getTimezoneOffset()).format('YYYY/MM/DD HH:mm:ss')
}

function showOverallRank(rank) {
  if (rank < 1000) {
    return rank
  } else if (rank < 1000000) {
    return Math.floor(rank / 1000) + 'k'
  }
  return Math.floor(rank / 100000) / 10 + 'm'
}

function getPlayerList(elementType) {
  https('https://letletme.top/common/qryPlayerInfoByElementType', 'GET', {
      elementType: elementType
    })
    .then(res => {
      return res.data
    }).catch(res => {
      console.log('fail:', res);
    })
}

export {
  getDeadline,
  showOverallRank,
  getPlayerList
}