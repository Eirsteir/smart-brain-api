BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('Jeff', 'jeff@gmail.com', 2, '2018-01-01');
INSERT INTO login (hash, email) VALUES ('$2a$10$YO56kkFLt6LnpqmayETSuuvbSsNm5zz3A.DT.7ZNIHSWFiyB7erM.', 'jeff@gmail.com');

COMMIT;
