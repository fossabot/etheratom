'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.
import React from 'react';
import { connect } from 'react-redux';
import { setAccounts, setSyncStatus, setMining, setHashrate } from '../../actions';

class NodeControl extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this._refreshSync = this._refreshSync.bind(this);
        this.getNodeInfo = this.getNodeInfo.bind(this);
    }
    async componentDidMount() {
        this.getNodeInfo();
    }
    async _refreshSync() {
        const accounts = await this.helpers.getAccounts();
        this.props.setAccounts({ accounts });
        this.getNodeInfo();
    }
    async getNodeInfo() {
        // get sync status
        const syncStat = await this.helpers.getSyncStat();
        this.props.setSyncStatus(syncStat);
        // get mining status
        const mining = await this.helpers.getMining();
        this.props.setMining(mining);
        // get hashrate
        const hashRate = await this.helpers.getHashrate();
        this.props.setHashrate(hashRate);
    }
    render() {
        const { coinbase, status, syncing, mining, hashRate } = this.props;

        return (
            <div id="NodeControl">
                <ul className='list-group'>
                    <li className='list-item'>
                        <span className='inline-block highlight'>Coinbase:</span>
                        <span className='inline-block'>{ coinbase }</span>
                    </li>
                </ul>
                {
                    (Object.keys(status).length > 0 && status instanceof Object) &&
                    <ul className="list-group">
                        <li className='list-item'>
                            <span className='inline-block highlight'>Sync progress:</span>
                            <progress className='inline-block' max='100' value={ (100 * (status.currentBlock/status.highestBlock)).toFixed(2) }></progress>
                            <span className='inline-block'>{ (100 * (status.currentBlock/status.highestBlock)).toFixed(2) }%</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Current Block:</span>
                            <span className='inline-block'>{ status.currentBlock }</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Highest Block:</span>
                            <span className='inline-block'>{ status.highestBlock }</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Known States:</span>
                            <span className='inline-block'>{ status.knownStates }</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Pulled States</span>
                            <span className='inline-block'>{ status.pulledStates }</span>
                        </li>
                        <li className='list-item'>
                            <span className='inline-block highlight'>Starting Block:</span>
                            <span className='inline-block'>{ status.startingBlock }</span>
                        </li>
                    </ul>
                }
                {
                    !syncing &&
                    <ul className="list-group">
                        <li className='list-item'>
                            <span className='inline-block highlight'>Syncing:</span>
                            <span className='inline-block'>{ `${syncing}` }</span>
                        </li>
                    </ul>
                }
                <ul className="list-group">
                    <li className='list-item'>
                        <span className='inline-block highlight'>Mining:</span>
                        <span className='inline-block'>{ `${mining}` }</span>
                    </li>
                    <li className='list-item'>
                        <span className='inline-block highlight'>Hashrate:</span>
                        <span className='inline-block'>{ hashRate }</span>
                    </li>
                </ul>
                <button className="btn" onClick={this._refreshSync}>Refresh</button>
            </div>
        );
    }
}

const mapStateToProps = ({ account, node }) => {
    const { coinbase } = account;
    const { status, syncing, mining, hashRate } = node;
    return { coinbase, status, syncing, mining, hashRate };
};

export default connect(mapStateToProps, { setAccounts, setSyncStatus, setMining, setHashrate })(NodeControl);
