const socket = io('http://localhost:8080');

$('#div-chat').hide();

socket.on('List_user_online', arrUserInfo => {
  $('#div-chat').show();
  $('#div-signup').hide();
  $('#ulUsers').html("");
  arrUserInfo.forEach(user => {
    const { ten, peerId } = user;
    $('#currentUser').html("");
    $('#currentUser').append(ten);
    $('#ulUsers').append(`<li id="${peerId}">${ten}</li>`);
  });

  socket.on('New_user', user => {
    const { ten, peerId } = user;
    $('#ulUsers').append(`<li id="${peerId}">${ten}</li>`);
  });

  socket.on('one_person_disconnect', peerId => {
    $(`#${peerId}`).remove();
  });

  // socket.on('one_person_logout', peerId => {
  //   $(`#${peerId}`).remove();
  // });
});

socket.on('Signup_fail',() => alert('Please enter other name!'));


function openStream(){
  const config = {audio:true, video:true};
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream (idVideoTag, stream){
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}

// openStream()
// .then(stream => playStream('localStream',stream));

const peer = new Peer({key: 't1hq3prrc4rc0udi'});
peer.on('open', id =>{
   $('#btnSignup').click(() => {
     const username = $('#txtUsername').val();
     socket.emit('user_sign_up',{ ten: username, peerId: id});
   });
});

$('#btnLogOut').click(() => {
  socket.emit('logout');
  $('#div-chat').hide();
  $('#div-signup').show();

});

// $("#btnCall").click(() => {
//   const id = $('#remoteId').val();
//   openStream()
//   .then(stream => {
//     playStream('localStream', stream);
//     const call = peer.call(id, stream);
//     call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
//   });
// });

peer.on('call', call => {
  openStream()
  .then(stream => {
    call.answer(stream);
    playStream('localStream', stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  });
});

$('#ulUsers').on('click', 'li', function(){

  const id = $(this).attr('id');
  openStream()
  .then(stream => {
    playStream('localStream', stream);
    const call = peer.call(id, stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  });
});
