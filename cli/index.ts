import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

const program = new Command();

// Detect if the project is React or Svelte based on package.json
async function detectFramework(projectPath: string): Promise<'react' | 'svelte' | null> {
    try {
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        if (dependencies.react) return 'react';
        if (dependencies.svelte) return 'svelte';
        return null;
    } catch (error) {
        return null;
    }
}

// Determine the components directory
async function getComponentsDir(projectPath: string, framework: 'react' | 'svelte'): Promise<string> {
    // Common component directories
    const possibleDirs = [
        'src/components',
        'src/lib/components',
        'components',
        'src'
    ];

    // Check each directory
    for (const dir of possibleDirs) {
        try {
            const fullPath = path.join(projectPath, dir);
            await fs.access(fullPath);
            return dir;
        } catch { }
    }

    // Default to src/components if none found
    const defaultDir = 'src/components';
    await fs.mkdir(path.join(projectPath, defaultDir), { recursive: true });
    console.log(chalk.green('✓'), 'Created folder:', defaultDir);

    return defaultDir;
}

async function copyComponent(framework: 'react' | 'svelte', projectPath: string) {
    try {
        // Get components directory
        const componentsDir = await getComponentsDir(projectPath, framework);

        // Source and destination paths
        const componentName = framework === 'react' ? 'draggable-number-input.tsx' : 'draggable-number-input.svelte';
        const sourcePath = path.join(__dirname, '..', 'src', framework, componentName);
        const destPath = path.join(projectPath, componentsDir, componentName);

        // Create components directory if it doesn't exist
        await fs.mkdir(path.join(projectPath, componentsDir), { recursive: true });

        // Read and copy the component
        const componentContent = await fs.readFile(sourcePath, 'utf-8');
        await fs.writeFile(destPath, componentContent, 'utf-8');

        // Copy any additional dependencies or types if needed
        if (framework === 'react') {
            const typesPath = path.join(__dirname, '..', 'src', framework, 'types.ts');
            const destTypesPath = path.join(projectPath, componentsDir, 'draggable-number-input.types.ts');
            await fs.copyFile(typesPath, destTypesPath);
        }

        console.log(chalk.green('✓'), 'Added the following files:');
        console.log(chalk.blue('-'), `${componentsDir}/${componentName}`);
        if (framework === 'react') {
            console.log(chalk.blue('-'), `${componentsDir}/types.ts`);
        }

        // Print usage instructions
        console.log('\n' + chalk.yellow('Usage:'));
        if (framework === 'react') {
            console.log(`
import { DraggableNumberInput } from '${componentsDir}/draggable-number-input';

function MyComponent() {
  return (
    <DraggableNumberInput
      value={0}
      onChange={(value) => console.log(value)}
    />
  );
}
`);
        } else {
            console.log(`
<script lang="ts">
  import DraggableNumberInput from '${componentsDir}/draggable-number-input.svelte';
  let value = 0;
</script>

<DraggableNumberInput
  bind:value
  on:change={(e) => console.log(e.detail)}
/>
`);
        }

    } catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error occurred');
        process.exit(1);
    }
}

program
    .name('draggable-number-input')
    .description('Add draggable number input component to your project')
    .version('0.1.0')
    .argument('[path]', 'Project path', '.')
    .option('-f, --framework <framework>', 'Specify framework (react or svelte)')
    .action(async (projectPath: string, options: { framework?: 'react' | 'svelte' }) => {
        try {
            // Resolve project path
            const resolvedPath = path.resolve(projectPath);

            // Detect framework if not specified
            const framework = options.framework || await detectFramework(resolvedPath);

            if (!framework) {
                console.error(chalk.red('Error: Could not detect framework. Please specify with --framework option.'));
                process.exit(1);
            }

            if (!['react', 'svelte'].includes(framework)) {
                console.error(chalk.red('Error: Invalid framework. Use "react" or "svelte".'));
                process.exit(1);
            }

            console.log(chalk.blue(`Installing draggable number input for ${framework}...`));
            await copyComponent(framework, resolvedPath);

        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error occurred');
            process.exit(1);
        }
    });

program.parse();