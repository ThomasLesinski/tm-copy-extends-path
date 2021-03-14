// ==UserScript==
// @name         GitHub Shopware - Copy extends path
// @namespace    https://www.ottscho-it-service.de/
// @version      1
// @description  Add btn to copy path for template extension
// @author       Thomas Lesinski
// @include      https://github.com/shopware/platform*
// @include      https://github.com/shopware/shopware*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const addCopyExtendsPathBtnInterval = setInterval(addCopyExtendsPathBtn, 250);

  function addCopyExtendsPathBtn() {
    const btnExistsAlready = document.querySelector('.btn-copy-extends-path');

    if (btnExistsAlready) {
      return;
    }

    const extendsPath = getExtendsPath();
    let additionalClass = '';

    if (extendsPath === 'hide') {
      return;
    } else if (extendsPath === '') {
      additionalClass = 'disabled';
    }

    const copyExtendsPathInput = createCopyExtendsPathInput(extendsPath);
    const copyExtendsPathBtn = createCopyExtendsPathBtn(additionalClass, copyExtendsPathInput);

    let goToFileBtn = document.querySelector('.js-pjax-capture-input');

    if (!goToFileBtn) {
      goToFileBtn = document.querySelector('.file-navigation .btn.mr-2.d-none.d-md-block');
    }
    
    if (typeof goToFileBtn == undefined) {
        return;
    }

    const GoToFileBtnParentEl = goToFileBtn.parentNode;

    document.querySelector('body').append(copyExtendsPathInput);
    GoToFileBtnParentEl.insertBefore(copyExtendsPathBtn, goToFileBtn);

    function createCopyExtendsPathInput(extendsPath) {
      const copyExtendsPathInput = document.createElement('input');
      copyExtendsPathInput.type = 'text';
      copyExtendsPathInput.style.opacity = '0';
      copyExtendsPathInput.value = extendsPath;

      return copyExtendsPathInput;
    }

    function createCopyExtendsPathBtn(additionalClass, copyExtendsPathInput) {
      const copyExtendsPathBtn = document.createElement('div');
      copyExtendsPathBtn.innerHTML = 'Copy extends path';
      copyExtendsPathBtn.classList.add('btn-copy-extends-path', 'btn', 'mr-2', 'd-none', 'd-md-block');

      if (additionalClass !== '') {
        copyExtendsPathBtn.classList.add(additionalClass);
      }

      copyExtendsPathBtn.addEventListener('click', () => {
        copyExtendsPathInput.select();
        document.execCommand("copy");
      });

      return copyExtendsPathBtn;
    }

    function getExtendsPath() {
      const extendsPathArr = [];
      let extendsPathString = '';

      let foundFirstIndicator = false;
      let foundSecondIndicator = false;

      const pathSegments = document.querySelectorAll('.file-navigation .js-path-segment').length > 0 ? document.querySelectorAll('.file-navigation .js-path-segment') : document.querySelectorAll('#blob-path .js-path-segment');

      if (pathSegments.length > 0) {
        const finalPathSegment = document.querySelector('.final-path').innerText.trim().toLowerCase();

        if (finalPathSegment.includes('.tpl') || finalPathSegment.includes('.html.twig')) {
          pathSegments.forEach((pathSegment) => {
            const pathSegmentText = pathSegment.innerText.trim().toLowerCase();

            if (foundFirstIndicator && foundSecondIndicator) {
              extendsPathArr.push(pathSegmentText);
            }

            if (!foundFirstIndicator && (pathSegmentText === 'resources' || pathSegmentText === 'frontend')) {
              foundFirstIndicator = true;
            }

            if (!foundSecondIndicator && (pathSegmentText === 'views' || pathSegmentText === 'bare')) {
              foundSecondIndicator = true;
            }
          });

          if (extendsPathArr.length > 0) {
            extendsPathArr.push(finalPathSegment);
            extendsPathString = extendsPathArr.join('/');
          }
        } else {
          return 'hide';
        }
      }

      return extendsPathString;
    }
  }
})();
