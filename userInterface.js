var blessed = require('blessed');

module.exports = {

    init: function() {
        var screen = blessed.screen({
            autopadding: true,
            smartCSR: true,
            title: 'Slack',
            fullUnicode: true
            }),

            container = blessed.box({
                width: '100%',
                height: '100%',
                style: {
                    fg: '#bbb',
                    bg: '#1d1f21'
                }
            }),

            sideBar = blessed.box({
                width: '30%',
                height: '100%',
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#888'
                    }
                }
            }),

            channelTitle = blessed.text({
                width: '90%',
                left: '5%',
                align: 'center',
                content: '{bold}Channels{/bold}',
                tags: true
            }),

            channelList = blessed.list({
                width: '90%',
                height: '63%',
                left: '5%',
                top: '2%',
                keys: true,
                vi: true,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#fff'
                    },
                    selected: {
                        bg: '#000',
                        fg: '#fff'
                    }
                },
                tags: true
            }),

            dmTitle = blessed.text({
                width: '90%',
                left: '5%',
                top: '65%',
                align: 'center',
                content: '{bold}Messages{/bold}',
                tags: true
            }),

            dmList = blessed.list({
                width: '90%',
                height: '31%',
                left: '5%',
                top: '67%',
                keys: true,
                vi: true,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#fff'
                    },
                    selected: {
                        bg: '#000',
                        fg: '#fff'
                    }
                },
                tags: true
            }),

            mainWindow = blessed.box({
                width: '70%',
                height: '100%',
                left: '30%',
                //scrollable: true,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#888'
                    }
                }
            }),

            mainWindowTitle = blessed.text({
                width: '90%',
                tags: true
            }),

            chatWindow = blessed.box({
                width: '90%',
                height: '75%',
                left: '5%',
                top: '10%',
                scrollable: true,
                alwaysScroll: true,
                tags: true,
                style: {
                    border: {
                        fg: '#fff'
                    }
                }
            }),

            messageInput = blessed.textbox({
                width: '90%',
                left: '5%',
                height: '15%',
                top: '83%',

                keys: true,
                inputOnFocus: true,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#fff'
                    }
                }
            });

        sideBar.append(channelTitle);
        sideBar.append(channelList);
        sideBar.append(dmTitle);
        sideBar.append(dmList);
        mainWindow.append(mainWindowTitle);
        mainWindow.append(chatWindow);
        mainWindow.append(messageInput);
        container.append(sideBar);
        container.append(mainWindow);
        screen.append(container);

        function keyBindings(ch, key) {
            switch (key.full) {
                case 'escape': process.exit(0);
                    break;
                case 'C-c': channelList.focus(); // ctrl-c for channels
                    break;
                case 'C-r': dmList.focus(); // ctrl-r for direct messages
                    break;
                case 'C-w': messageInput.focus(); // ctrl-w for write
                    break;
                case 'C-l': chatWindow.focus(); // ctrl-l for message list
                    break;
            }
            return;
        }

        // Quit on Escape or Control-C.
        channelList.on('keypress', keyBindings);
        chatWindow.on('keypress', keyBindings);
        dmList.on('keypress', keyBindings);
        messageInput.on('keypress', function(ch, key){
            if (    key.full === 'escape' ||
                    key.full === 'C-c'    ||
                    key.full === 'C-r'    ||
                    key.full === 'C-w'    ||
                    key.full === 'C-l'   ) {
                messageInput.cancel();
                keyBindings(ch, key);
            }
        });

        // scrolling in chat window
        chatWindow.on('keypress', function(ch, key) {
            if (key.name === 'up') {
                chatWindow.scroll(-1);
                screen.render();
                return;
            }
            if (key.name === 'down') {
                chatWindow.scroll(1);
                screen.render();
                return;
            }
        });

        // event handlers for focus and blur of inputs
        channelList.on('focus', function() {
            channelList.style.border = {'fg': '#ff0000'};
            screen.render();
        });
        channelList.on('blur', function() {
            channelList.style.border = {'fg': '#888'};
            screen.render();
        });
        dmList.on('focus', function() {
            dmList.style.border = {'fg': '#ff0000'};
            screen.render();
        });
        dmList.on('blur', function() {
            dmList.style.border = {'fg': '#888'};
            screen.render();
        });
        messageInput.on('focus', function() {
            messageInput.style.border = {'fg': '#ff0000'};
            screen.render();
        });
        messageInput.on('blur', function() {
            messageInput.style.border = {'fg': '#888'};
            screen.render();
        });
        chatWindow.on('focus', function() {
            mainWindow.style.border = {'fg': '#cc6666'};
            screen.render();
        });
        chatWindow.on('blur', function() {
            mainWindow.style.border = {'fg': '#888'};
            screen.render();
        });

        return {
            screen: screen,
            sideBar: sideBar,
            channelTitle: channelTitle,
            channelList: channelList,
            dmTitle: dmTitle,
            dmList: dmList,
            mainWindow: mainWindow,
            mainWindowTitle: mainWindowTitle,
            chatWindow: chatWindow,
            messageInput: messageInput
        };
    }

};
