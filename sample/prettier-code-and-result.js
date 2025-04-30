import Prettier from '../node_modules/prettier/standalone.mjs';
import prettierBabelPlugin from '../node_modules/prettier/plugins/babel.mjs';
import prettierEstreePlugin from '../node_modules/prettier/plugins/estree.mjs';

const prettierJsOptions = {
	parser: 'babel',
	plugins: [prettierBabelPlugin, prettierEstreePlugin],
	singleQuote: true,
	tabWidth: 4
};
export default function prettierCodeAndResult(containerEl, code) {
	Prettier.format(code.toString(), prettierJsOptions).then((formattedCode) => {
		const result = code();
		containerEl.insertAdjacentHTML(
			'beforeend',
			`Code:<pre><code>${formattedCode}</code></pre>Result:<pre><code>${JSON.stringify(result, null, 4)}</code></pre>`
		);
	});
}
