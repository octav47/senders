function getID() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return getRandomInt(0, 9000);
}

function Net(id) {
    this.id = id;
    this.connected = {};
    this.senders = {};
    this.register = function (sender) {
        this.senders[sender.id] = {
            sender: sender
        };
    };
    this.connect = function (net) {
        this.connected[net.id] = net;
        net.connected[this.id] = this;
    };
    function union(net) {
        for (var i in this.senders) {
            if (this.senders.hasOwnProperty(i)) {
                net.senders[i] = this.senders[i];
            }
        }
        for (var i in net.senders) {
            if (net.senders.hasOwnProperty(i)) {
                this.senders[i] = net.senders[i];
            }
        }
    };
}

var net = new Net('net_1');
var net2 = new Net('net_2');

net.connect(net2);

function Sender(id, net, name) {
    this.id = id;
    this.name = name;
    this.net = net;
    this.connected = {};
    this.send = function (id, data) {
        var reciever = getReciever(id, this.net, {}, 0);
        reciever.recieve(data);
    };
    this.recieve = function (data) {
        console.log(((this.name == undefined) ? this.id : (this.name + 
            ' [' + this.id + ']')) + ':' + data);
    };
    this.tracert = function (id) {
        for (var i in getReciever(id, this.net, {}, 0, true)) {
            
        }
    };
    
    function getReciever(id, net, visited, step, route) {
        visited[net.id] = step;
        step++;
        if (net.senders.hasOwnProperty(id)) {
            if (route === true) {
                return visited;
            }
            return net.senders[id].sender;
        }
        for (var i in net.connected) {
            if (net.connected.hasOwnProperty(i) && !visited.hasOwnProperty(i)) {
                return getReciever(id, net.connected[i], visited, step, route);
            }
        }
    }
    
    net.register(this);
}

var s1 = new Sender('s_1', net);
var s2 = new Sender('s_2', net2);


// s1.send('s_2', '123');
// s2.send('s_1', '321');
// s1.send(s2.id, 'hello, world!');
// s2.send(s1.id, 'hello, world!');

s1.tracert('s_2')