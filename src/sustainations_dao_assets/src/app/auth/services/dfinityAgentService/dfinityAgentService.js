import FuseUtils from '@fuse/utils/FuseUtils';

/* eslint-disable camelcase */

class DfinityAgentService extends FuseUtils.EventEmitter {
  login = (uid) => {
    this.emit('onLogin', 'Signed in', uid);
  };

  logout = () => {
    this.emit('onLogout', 'Logged out');
  };
}

const instance = new DfinityAgentService();

export default instance;
