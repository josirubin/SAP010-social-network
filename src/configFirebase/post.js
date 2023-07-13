import { getDoc } from 'firebase/firestore';
import {
  collection, db, auth, addDoc, getDocs, arrayUnion, arrayRemove,
} from './configFirebase.js';

export const publicações = async (mensagem) => {
  const timestamp = new Date().getTime();
  const document = await addDoc(collection(db, 'Post'), {
    name: auth.currentUser.displayName,
    author: auth.currentUser.uid,
    msg: mensagem,
    likes: [],
    timestamp,
  });
  return document;
};
// FUNÇÃO DE DAR O LIKE
export async function likePost(likeid, like) {
  const db = getFirestore();
  const commentRef = getDoc(db, 'Post', likeid);
  const commentDoc = await getDocs(commentRef);
  const authUid = getAuth().currentUser.uid;
  const commentData = commentDoc.data();

  const likeCount = commentData.likeCount || 0;

  if (like && (!commentData.like || !commentData.like.includes(authUid))) {
    await updateDoc(commentRef, {
      like: arrayUnion(authUid),
      likeCount: likeCount + 1,
    });
  }

  if (!like && commentData.like && commentData.like.includes(authUid)) {
    await updateDoc(commentRef, {
      like: arrayRemove(authUid),
      likeCount: likeCount - 1,
    });
  }
}

export const retornoPublicacoes = async () => {
  const publicacoes = [];
  const querySnapshot = await getDocs(collection(db, 'Post'));

  querySnapshot.forEach((post) => {
    publicacoes.push({ ...post.data(), id: post.id });
  });

  return publicacoes;
};
