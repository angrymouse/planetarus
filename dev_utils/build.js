require("esbuild")
	.build({
		entryPoints: ["../index.js"],
		bundle: true,
		outfile: "../build.browser.js",
		minify: true,
		sourcemap: true,
		platform: "browser",
	})
	.catch(() => process.exit(1));
require("esbuild")
	.build({
		entryPoints: ["../index.js"],
		bundle: true,
		outfile: "../build.node.js",
		minify: true,
		sourcemap: true,
		platform: "node",
	})
	.catch(() => process.exit(1));
