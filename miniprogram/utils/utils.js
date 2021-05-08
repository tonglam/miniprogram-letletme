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

export {
  getDeadline,
  showOverallRank
}