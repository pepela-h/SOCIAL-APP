/*abstract*/ class SessionStore {
  findSessionById(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}
class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }
  findSessionById(id) {
    return this.sessions.get(id);
  }
  saveSession(id, session) {
    this.sessions.set(id, session);
  }
  findAllSessions() {
    return [...this.sessions.values()];
  }
}

const getRandomSession = () => {
    const rd = require('crypto').randomBytes(8).toString('hex')
    return rd;
}
module.exports = { InMemorySessionStore,getRandomSession };

