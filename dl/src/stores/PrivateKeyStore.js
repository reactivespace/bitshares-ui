import Immutable from "immutable";
import alt from "../alt-instance";
import BaseStore from "./BaseStore";
import PrivateKeyActions from "../actions/PrivateKeyActions";
import Utils from "../common/utils";
import {Key} from "./tcomb_structs";
import iDB from "../idb-instance";

import hash from "common/hash"

class PrivateKeyStore extends BaseStore {
    
    constructor(name = "default") {
        super();
        this.name = name;
        this.keys = Immutable.Map();
        this.bindListeners({
            onAddKey: PrivateKeyActions.addKey
        });
        this._export("loadData");
    }

    loadData() {
        iDB.load_data(this.name + "_encrypted_private_keys").then( data => {
            for(let key of data) {
                this.keys.set(key.id,Key(key));
            }
        });
    }

    onAddKey(key) {
        
        iDB.add_to_store(this.name + "_encrypted_private_keys", key).then( () => {
            console.log("[PrivateKeyStore.js:20] ----- PrivateKeyActions: key added ----->", key);
            this.keys.set(key.id,Key(key));
        });
    }

}

module.exports = alt.createStore(PrivateKeyStore, "PrivateKeyStore");
