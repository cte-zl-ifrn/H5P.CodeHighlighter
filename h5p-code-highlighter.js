var H5P = H5P || {};

H5P.CodeHighlighter = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    this.$ = $(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      'shortcutMode': 'content',
      'preventTrigger': 'all',
      'showStartButton': true,
      'pressButtonToStart': 'Press the button to start the activity',
      'startButton': 'Start',
      'pressKeys': 'Press the following keys on your keyboards',
      'continueButton': 'Continue'
    }, options);
    // Keep provided id.
    this.id = id;
  }

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    const self = this;

    $container.addClass('h5p-code-highlighter');

    this.editor = CodeMirror($container[0], {
      value: CodeMirror.H5P.decode(this.options.code) || '',
      keyMap: 'sublime',
      tabSize: 2,
      indentWithTabs: true,
      lineNumbers: this.options.lineNumbers,
      readOnly: this.options.readOnly,
      lineWrapping: this.options.lineWrapping,
      matchBrackets: true,
      foldGutter: this.options.foldGutter,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      styleActiveLine: {
        nonEmpty: true
      },
      extraKeys: {
        "F11": function (cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function (cm) {
          if (cm.getOption("fullScreen")) {
            cm.setOption("fullScreen", false);
          }
        }
      }
    });

    this.editor.refresh(); // required to avoid bug where line number overlap code that might happen in some condition

    this.setLanguage(this.options.language);

    this.trigger('resize');
  };

  C.prototype.setLanguage = function (mode) {
    if (mode === 'null') {
      this.editor.setOption('mode', null);
      return;
    }
    let modeInfo = CodeMirror.findModeByName(mode) || CodeMirror.findModeByMIME(mode);
    if (modeInfo) {
      this.editor.setOption('mode', modeInfo.mime); // set the mode by using mime because it allow variation (like typescript which is a variation of javascript)
      CodeMirror.autoLoadMode(this.editor, modeInfo.mode, { // load the language file if required, then refresh the editor
        path: function (mode) { // path is safe because mode is from modeInfo.mime
          return H5P.getLibraryPath('CodeMirror-1.0') + '/mode/' + mode + '/' + mode + '.js';
        }
      });
    } else {
      this.editor.setOption('mode', null);
    }
  }

  return C;
})(H5P.jQuery);