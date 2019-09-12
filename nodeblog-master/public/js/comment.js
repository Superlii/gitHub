var prepage = 2
var page = 1
var pages = 0
var comments = []

/**
 * @desc ajax 请求
 */
function blogAjax(url, data, fn) {
  $.ajax({
    type: "POST",
    url: url,
    data: data,
    dataType: "JSON",
    error: function(data) {
      alert('加载异常，请稍后重试')
    },
    success: function(res) {
     typeof fn === 'function' && fn(res)
    }
  });
}
//隐藏评论
$('.article-page').on('mouseout','div',function(){
  $(this).display='none'
  console.log('123')
})
/**
 * @desc 渲染评论
 */
function renderComment(data) {
  $('.comment-times').html(data.length)
  $('.comment-tips').html('')
  
  pages = Math.ceil(data.length / prepage)
  var start = Math.max(0, (page-1)*prepage)
  var end = Math.min(start + prepage, data.length)
  
  var $lis = $('.comment-page li')
  $lis.eq(1).html(page + '/' + pages)
  if (page <= 1) {
  	page = 1
  	$lis.eq(0).html('<span>没有上一页了</span>')
  } else {
    $lis.eq(0).html('  <button href="">上一页 </button>')
  }
  if (page >= pages) {
    $lis.eq(2).html('<span>没有下一页了</span>')
  } else {
    $lis.eq(2).html('  <button href="">下一页 </button>')
  }
  
  var html = ''
  for (var i =start; i < end; i++) {
    html += `<div class="comment-item">
      <p class="commit-title"><span>${data[i].username}</span> <span>${formatDate(data[i].postTime)}</span></p>
      <p class="comment-conent">${data[i].content}</p>
    </div>`
  }
  $('.comment-list').html(html)
}

/**
 * @desc 格式化时间
 */
function formatDate(time) {
  var d = new Date(time)
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-'
    + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
}

blogAjax('/api/comment', {contentid: $(".contentId").val()}, function (res) {
  if (res.code == '666') {
    comments = res.data.comments.reverse()
    renderComment(comments)
  }
})

$('.comment-page').on('click', 'button', function () {
  if ($(this).parent().hasClass('previous')) {
    // console.log(page)
  	page--
  } else {
    page++
  }
  renderComment(comments)
})

// 评论
$(".comment-btn").on('click', function () {
  var comment = "/api/comment/post"
  var data = {
    contentid: $(".contentId").val(),
    content: $(".comment-area").val()
  }
  blogAjax(comment, data, function (res) {
    $('.comment-area').val('')
    if (res.code == '666') {
      var comments = res.data.comments.reverse()//实现底部评论从上到下渲染
      renderComment(comments)//将评论渲染到底部
    } else {
      $('.comment-tips').html(res.message)
    }
  })
})