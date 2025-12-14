// plugins/gh-social-preview/index.js
const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');
const { loggerPath } = require('@paths');
const logger = require(loggerPath);
const { generateSVG } = require('./ribbon');


class GhSocialPreviewHandler {
  constructor(coreUtils) {
    this.markdownUtils = coreUtils.markdownUtils;
    this.pdfGenerator = coreUtils.pdfGenerator;
  }

  async generate(data, pluginSpecificConfig, globalConfig, outputDir, outputFilenameOpt, pluginBasePath) {
    logger.info(`(GhSocialPreviewHandler): Processing for plugin '${pluginSpecificConfig.description || 'gh-social-preview'}'.`);

    const { markdownFilePath } = data;
    if (!markdownFilePath || !fss.existsSync(markdownFilePath)) {
      throw new Error(`Input Markdown file not found: ${markdownFilePath}`);
    }

    try {
      await fs.mkdir(outputDir, { recursive: true });

      const rawMarkdownContent = await fs.readFile(markdownFilePath, 'utf8');
      const { data: fm, content: markdownBody } = this.markdownUtils.extractFrontMatter(rawMarkdownContent);

      let backgroundSvg = '';
      try {
        backgroundSvg = generateSVG();
      } catch (err) {
        logger.warn(`Could not generate SVG: ${err.message}`);
      }

      const name = fm.name || fm.title || 'Unnamed';
      const htmlBodyContent = `
                <div class="preview-container">
                  ${backgroundSvg ? `<div class="preview-background">${backgroundSvg}</div>` : ''}
                  <div class="preview-text">${name}</div>
                </div>
            `;

      const cardNameForFile = fm.name || (markdownBody.split('\n')[0].replace(/^#+\s*/, '')) || 'gh-social-preview';
      const baseOutputFilename = outputFilenameOpt || `${this.markdownUtils.generateSlug(cardNameForFile)}.pdf`;
      const finalOutputPdfPath = path.join(outputDir, baseOutputFilename);

      const pdfOptions = {
        ...(globalConfig.global_pdf_options || {}),
        ...(pluginSpecificConfig.pdf_options || {}),
        margin: {
          ...((globalConfig.global_pdf_options || {}).margin || {}),
          ...((pluginSpecificConfig.pdf_options || {}).margin || {}),
        }
      };
      if (pdfOptions.width || pdfOptions.height) {
        delete pdfOptions.format;
      }

      const cssFileContentsArray = [];
      if (pluginSpecificConfig.css_files && Array.isArray(pluginSpecificConfig.css_files)) {
        for (const cssFile of pluginSpecificConfig.css_files) {
          const cssFilePath = path.resolve(pluginBasePath, cssFile);
          if (fss.existsSync(cssFilePath)) {
            cssFileContentsArray.push(await fs.readFile(cssFilePath, 'utf8'));
          }
        }
      }

      await this.pdfGenerator.generatePdf(
        htmlBodyContent,
        finalOutputPdfPath,
        pdfOptions,
        cssFileContentsArray
      );

      logger.success(`Successfully generated preview: ${finalOutputPdfPath}`);
      return finalOutputPdfPath;

    } catch (error) {
      logger.error(`(GhSocialPreviewHandler): Failed to generate preview for ${markdownFilePath}: ${error.message}`);
      if (error.stack) {
        logger.error(error.stack);
      }
      throw error;
    }
  }
}
module.exports = GhSocialPreviewHandler;
