const vscode = require('vscode');

function activate(context) {
    const classes = {
        EventType: [
            { name: 'onKeyEvent', description: 'Triggered on key', type: 2 },
            { name: 'onMouseEvent', description: 'Triggered on mouse click', type: 2 },
            { name: 'onPacketReceiveEvent', description: 'Triggered when packet recived', type: 2 },
            { name: 'onTickEvent', description: 'Triggered on each tick', type: 2 },
            { name: 'onRenderEvent', description: 'Triggered during render', type: 2 },
        ],
		Settings: [
            { name: 'CreateSetting', description: 'Creates a setting', type: 1 },
            { name: 'GetSetting', description: 'Recives a setting', type: 1 },
			{ name: 'AddHeader', description: 'adds header', type: 1 },
			{ name: 'AddTextBox', description: 'adds textbox', type: 1 },
			{ name: 'AddToggle', description: 'adds toggle', type: 1 },
			{ name: 'AddSlider', description: 'adds slider', type: 1 },
        ],
		GUI: [
            { name: 'Color', description: 'returns color', type: 1 },
            { name: 'RoundedRect', description: 'Draws RoundedRect on screen', type: 1 },
			{ name: 'TextWithFont', description: 'Draws TextWithFont on screen', type: 1 },
			{ name: 'RoundedHollowRect', description: 'Draws RoundedHollowRect on screen', type: 1 },
        ],
		TextPacket: [
            { name: 'getMessage', description: 'getMessage returns received message', type: 1 },
            { name: 'getType', description: 'getType returns text packet types', type: 1 },
        ],
		Player: [
            { name: 'getPlayerName', description: 'Returns the name of the player', type: 1 },
            { name: 'getX', description: "Returns player's X-coordinate", type: 1 },
			{ name: 'getY', description: "Returns player's Y-coordinate", type: 1 },
			{ name: 'getZ', description: "Returns player's Z-coordinate", type: 1 },
			{ name: 'isOnGround', description: "True/False, player is on ground", type: 1 },
        ],
		Constraints: [
            { name: 'PercentageConstraint', description: 'Calculates a percentage-based constraint', type: 1 },
            { name: 'RelativeConstraint', description: 'Calculates a relative constraint', type: 1 },
			{ name: 'CenterConstraint', description: 'Calculates the center position', type: 1 },
			{ name: 'RoundingConstraint', description: 'Calculates rounding constraints for radius X and Y', type: 1 },
			{ name: 'FontScaler', description: 'Scales the font size based on a dimension', type: 1 },
			{ name: 'CalculatePercentage', description: 'Calculates percentage-based positions for X and Y', type: 1 },
        ],
		Client: [
            { name: 'setMouseVisible', description: 'locks or unlocks mouse', type: 1 },
        ],
		ModuleManager: [
            { name: 'GetModuleByName', description: 'returns module', type: 1 },
        ],
		ModuleSettings: [
            { name: 'GetSetting', description: 'returns setting of other module', type: 1 },
        ],
    };

    const luaCompletionProvider = vscode.languages.registerCompletionItemProvider(
        { language: 'lua', scheme: 'file' },
        {
			provideCompletionItems(document, position) {
				const completions = [];
			
				const linePrefix = document.lineAt(position).text.substring(0, position.character);
			
				const classMatch = Object.keys(classes).find(className => linePrefix.endsWith(className + '.'));
			
				if (classMatch) {
					classes[classMatch].forEach(method => {
						const methodCompletion = new vscode.CompletionItem(
							method.name,
							vscode.CompletionItemKind.Method
						);
						methodCompletion.detail = `${classMatch}.${method.name}`;
						methodCompletion.documentation = method.description;
						if (method.type === 1) {
							methodCompletion.insertText = new vscode.SnippetString(
								method.name + '(${1})'
							);
						}
						completions.push(methodCompletion);
					});
				} else {
					for (const [className] of Object.entries(classes)) {
						const classCompletion = new vscode.CompletionItem(
							className,
							vscode.CompletionItemKind.Class
						);
						classCompletion.detail = `Class: ${className}`;
						classCompletion.documentation = `Class representing ${className}`;
						completions.push(classCompletion);
					}
			
					const onEventCompletion = new vscode.CompletionItem(
						'onEvent',
						vscode.CompletionItemKind.Function
					);
					onEventCompletion.detail = 'onEvent function template';
					onEventCompletion.documentation = 'Inserts a template for handling events';
					onEventCompletion.insertText = new vscode.SnippetString(
						'onEvent(EventType.${1|onKeyEvent,onMouseEvent,onPacketReceiveEvent,onTickEvent,onRenderEvent|}, function()' +
						'\n	${2}' +
						'\nend)'
					);
					completions.push(onEventCompletion);
				}
			
				return completions;
			},			
        },
        '.'
    );

    context.subscriptions.push(luaCompletionProvider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
