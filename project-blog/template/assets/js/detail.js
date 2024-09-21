const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get('id'))
let currentPage = parseInt(urlParams.get('page'));

const elCategoryName = document.getElementById('categoryName');
const elPublishDate = document.getElementById('publishDate');
const elArticleTitle = document.getElementById('articleTitle')
const elArticleContent = document.getElementById('articleContent')
const elArticleThumb = document.getElementById('articleThumb')
const elCommentForm = document.getElementById('commentForm')
const elCommentNotice = document.getElementById('commentNotice')
const elCommentContent = document.getElementById('commentContent')
const elListComment = document.getElementById('listComment')
const elTotalComment = document.getElementById('totalComment')
const elCommentMessageReply = document.getElementById('commentMessageReply')
const elCancelReply = document.getElementById('cancelReply')
const elReplyEmail = document.getElementById('replyEmail')

let email = '';
const COMMENTS = JSON.parse(localStorage.getItem('COMMENTS')) || [];
let commentByArticle = COMMENTS.filter(item => item.articleId === id);
let parrentCommentId = null;
let level=1;


API.callWithToken().get('auth/me').then(res => {
  email = res.data.data.email
  elCommentForm.classList.remove('d-none');
  elCommentNotice.classList.add('d-none');
}).catch(err => {
  elCommentForm.classList.add('d-none');
  elCommentNotice.classList.remove('d-none');
}).finally(function () {
  renderComments(commentByArticle);
})

API.call().get(`articles/${id}`).then(response => {
  const article = response.data.data;
  elCategoryName.innerText = article.category.name;
  elPublishDate.innerText = article.publish_date;
  elArticleTitle.innerText = article.title;
  elArticleContent.innerHTML = article.content;
  elArticleThumb.src = article.thumb;
  if (!RECENT_POSTS.includes(id)) {
    if (RECENT_POSTS.length === 4) {
      RECENT_POSTS.shift();
    }
    RECENT_POSTS.push(id);
    localStorage.setItem('RECENT_POSTS', JSON.stringify(RECENT_POSTS));
  }
})


elCommentForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const content = elCommentContent.value.trim();
  if (content) {
    const newComment = {
      id: self.crypto.randomUUID(),
      email,
      content: level===1 ? content : `<span class="text-danger">@${elReplyEmail.innerText}</span>: ${content}`,
      dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      articleId: id,
    }
    if (parrentCommentId) {
      const parentIdx = COMMENTS.findIndex(item => item.id === parrentCommentId)
      COMMENTS[parentIdx].childItems.push(newComment);
    } else {
      newComment.childItems = [];
      COMMENTS.unshift(newComment);
    }
    localStorage.setItem('COMMENTS', JSON.stringify(COMMENTS))
    commentByArticle = COMMENTS.filter(item => item.articleId === id);
    renderComments(commentByArticle);
    elCommentContent.value = '';
    parrentCommentId = null;
    elCommentMessageReply.classList.add('d-none');
  } else {
    alert('Vui lòng nhập nội dung bình luận!');
  }
})

elListComment.addEventListener('click', function (e) {
  const el = e.target;
  if (el.classList.contains('btn-reply-comment')) {
    parrentCommentId = el.dataset.parentId;
    elReplyEmail.innerText = el.dataset.replyEmail;
    level = parseInt(el.dataset.level);
    elCommentMessageReply.classList.remove('d-none');
  }
})

elCancelReply.addEventListener('click', function (e) {
  e.preventDefault();
  parrentCommentId = null;
  elCommentMessageReply.classList.add('d-none');

})


function renderComments(list) {
  let html = '';
  list.forEach(element => {
    html += renderCommentItem(element, element.id, true);
  });
  elListComment.innerHTML = html;
  elTotalComment.innerText = `${list.length} bình luận`
}

function renderCommentItem(data, parentId = null, isParent = true) {
  const level= isParent? 1:2;
  const btnReply = email ? `<a href="#commentFormWrapper" class="btn btn-sm btn-primary ms-auto btn-reply-comment" data-level="${level}" data-reply-email="${data.email}" data-parent-id="${parentId}">Trả lời</a>` : '';
  const dateTime = dayjs(data.dateTime).fromNow();

  const className = isParent ? 'comment' : 'reply'

  const numberAvatar = Math.floor(Math.random() * 6) + 1;

  let htmlChild = '';
  if (isParent && data.childItems.length > 0) {
    htmlChild += `<div class="comment-replies bg-light p-3 mt-3 rounded">`
    htmlChild += `<h6
                          class="comment-replies-title mb-4 text-muted text-uppercase">${data.childItems.length} Bình luận</h6>`
    data.childItems.forEach(itemChild => {
      htmlChild += renderCommentItem(itemChild, parentId, false);
    })
    htmlChild += `</div>`
  }

  return `<div class="${className} d-flex mb-4">
                    <div class="flex-shrink-0">
                      <div class="avatar avatar-sm rounded-circle">
                        <img class="avatar-img" src="assets/img/person-${numberAvatar}.jpg"
                          alt
                          class="img-fluid">
                      </div>
                    </div>
                    <div class="flex-shrink-1 ms-2 ms-sm-3 flex-grow-1">
                      <div class="${className}-meta d-flex">
                        <h6 class="mb-0 me-2">${data.email}</h6>
                        <span class="text-muted">${dateTime}</span>
                        ${btnReply}
                      </div>
                      <div class="${className}-body">
                        ${data.content}
                      </div>
                       ${htmlChild}
                    </div>
                  </div>`
}
